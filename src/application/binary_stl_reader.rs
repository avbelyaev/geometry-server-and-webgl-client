use domain::model::mesh::Mesh;
use domain::model::triangle::Triangle;
use domain::model::point::Point;
use application::abstract_stl_reader::AbstractStlReader;

use regex::Regex;
use rocket::Data;
use std::env;
use std::fs::File;
use std::io::prelude::*;
use std::io::Cursor;
use base64::{encode, decode};
use std::str;
use byteorder::{LittleEndian, ReadBytesExt};


//struct BinaryStl {
//    content: [u],
//    triangles_num: u32,
//    triangles: Vec<Triangle>
//}

//impl BinaryStl {
//    fn new(bytes: Vec<u8>) -> Self {
//        BinaryStl{
//            content: bytes.as_slice(),
//            triangles_num: 0,
//            triangles: Vec::new(),
//        }
//    }
//
//    fn read_header<T: ReadBytesExt>(&self, cursor_to_content: &mut T) -> String {
//        let mut u8buf = [0u8; 80];
//        cursor_to_content.read(&mut u8buf);
//
////    let header = str::from_utf8(&u8buf).unwrap();
////    println!("H: {}", header);
//        str::from_utf8(&u8buf).unwrap().to_string()
//    }
//
//    fn read_content<T: ReadBytesExt>(&self, cursor_to_content: &mut T) -> &Vec<Triangle> {
//        unimplemented!()
//    }
//}


pub fn read_mesh_from_binary_stl_file(stl: Data) -> String {

    let bytes = convert_data_to_bytes(stl);
    let mut cursor = Cursor::new(bytes);

    let h = read_header(&mut cursor);
    println!("h:{}", h);

    let triang_num = read_size(&mut cursor);
    println!("s:{}", triang_num);

    let triangs = read_content(&mut cursor);

    // write bytes into file to read it byte by byte with cursor
//    let mut file = File::create("/tmp/mesh.stl").unwrap();
//    file.write_all(&bytes);

    "asdsa".to_string()
}

/// Unwraps base64 encoded data into vector of bytes
fn convert_data_to_bytes(data: Data) -> Vec<u8> {
    let mut content = String::new();
    data.open().read_to_string(&mut content);

    decode(&content).unwrap()
}


fn read_header<T: ReadBytesExt>(cursor: &mut T) -> String {
    let mut u8buf = [0u8; 80];
    cursor.read(&mut u8buf);

//    let header = str::from_utf8(&u8buf).unwrap();
//    println!("H: {}", header);
    str::from_utf8(&u8buf).unwrap().to_string()
}

fn read_size<T: ReadBytesExt>(cursor: &mut T) -> u32 {
    cursor.read_u32::<LittleEndian>().unwrap()
}

fn read_content<T: ReadBytesExt>(cursor: &mut T) -> u32 {
    1
}