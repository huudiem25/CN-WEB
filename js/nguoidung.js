var currentUser;
var tongTienTatCaDonHang = 0; // lưu tổng tiền từ tất cả các đơn hàng đã mua
var tongSanPhamTatCaDonHang = 0;

window.onload = function () {
  khoiTao();

  // autocomplete cho khung tim kiem
  autocomplete(document.getElementById('search-box'), list_products);

  // thêm tags (từ khóa) vào khung tìm kiếm
  var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
  for (var t of tags) addTags(t, "index.php?search=" + t);

  currentUser = getCurrentUser();

  getCurrentUser(
    (data) => {
      if (data) {
        $.ajax({
          type: "POST",
          url: "php/xulydonhang.php",
          data: {
            request: "getCurrentUser",
            
          },
          success: function (data) {
            $(".listDonHang").html(tableDonHang_Html(JSON.parse(data)));
          },
          error: function (e) {
            console.log(e.responseText);
          },
        });
       
      } 
      
      else {
        var warning = `<h2 style="color: red; font-weight:bold; text-align:center; font-size: 2em; padding: 50px;">
                            Bạn chưa đăng nhập !!
                        </h2>`;
        document.getElementsByClassName("infoUser")[0].innerHTML = warning;
      }
    },
    (e) => {
      console.log(e.responseText);
    }
  );
};

function xemChiTiet(mahd) {
  $.ajax({
    type: "POST",
    url: "php/xulychitietdonhang.php",
    data: {
      request: "getbyid",
      mahd: mahd,
    },
    success: function (data) {
      $("#chitietdonhang").html(tableChiTietDonHang_Html(JSON.parse(data)));
    },
    error: function (e) {
      console.log(e.responseText);
    },
  });
}

function tableChiTietDonHang_Html(data) {
  let str = `<table class="table table-striped" >
		<tr>
			<th scope="col" >Sản phẩm</th>
			<th scope="col" >Số lượng</th>
			<th scope="col" >Đơn giá</th>
		</tr>`;

  for (let i = 0; i < data.length; i++) {
    let row = data[i];

    str += `<tr>
					<td scope="col">
						<a href="chitietsanpham.php?${row.MaSP}">
							<img style="width:100px;height:100px;" src="${row.SP.HinhAnh}"><br>
							${row.SP.TenSP}
						</a>
					</td>
					<td scope="col">${row.SoLuong}</td>
          <td scope="col">
            ${Number(row.DonGia).toLocaleString()} đ
          </td>
				</tr>`;
  }
  str += "</table>";

  return str;
}

function tableDonHang_Html(data) {
  let str = "";
  if (data.length > 0) {
    str = `<table class="table table-striped" style="margin: 50px 0;" >
      <tr>
      <th  style="font-weight:600">Mã đơn hàng</th>
      <th  style="font-weight:600">Ngày lập</th>
      <th  style="font-weight:600">Người nhận</th>
      <th  style="font-weight:600">SDT</th>
      <th  style="font-weight:600">Địa chỉ</th>
      <th  style="font-weight:600">Phương thức TT</th>
      <th  style="font-weight:600">Tổng tiền</th>
      <th  style="font-weight:600">Trạng thái</th>
      <th  style="font-weight:600">Chi tiết</th>
    </tr>`;

    for (donhang of data) {
      str += `<tr>
          <td >${donhang.MaHD}</td>
          <td >${donhang.NgayLap}</td>
          <td >${donhang.NguoiNhan}</td>
          <td >${donhang.SDT}</td>
          <td >${donhang.DiaChi}</td>
          <td >${donhang.PhuongThucTT}</td>
          <td >${Number(donhang.TongTien).toLocaleString()} đ</td>
          <td >${donhang.TrangThai}</td>
          <td >
            <button 
              type="button" 
              class="btn btn-primary"
              data-toggle="modal" 
              data-target="#exampleModal" 
              onclick="xemChiTiet('${donhang.MaHD}')"
            >
              Xem
            </button>
          </td>
        </tr>`;
    }
    str += "</table>";
  } else {
    str = `<h2 class="empty-noti">
          Hiện chưa có đơn hàng nào, 
          <a href="index.php" style="color:blue">Mua ngay</a>
        </h2>`;
  }

  return str;
}

// Phần Thông tin người dùng
function addInfoUser(user) {
  if (!user) return;
  document.getElementsByClassName("infoUser")[0].innerHTML =
    `
    <hr>
    <table>
        <tr>
            <th colspan="3">THÔNG TIN KHÁCH HÀNG</th>
        </tr>
        <tr>
            <td>Tài khoản: </td>
            <td> <input type="text" value="` +
    user.username +
    `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'username')"></i> </td>
        </tr>
        <tr>
            <td>Mật khẩu: </td>
            <td style="text-align: center;"> 
                <i class="fa fa-pencil" id="butDoiMatKhau" onclick="openChangePass()"> Đổi mật khẩu</i> 
            </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3" id="khungDoiMatKhau">
                <table>
                    <tr>
                        <td> <div>Mật khẩu cũ:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Mật khẩu mới:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Xác nhận mật khẩu:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td> 
                            <div><button onclick="changePass()">Đồng ý</button></div> 
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Họ: </td>
            <td> <input type="text" value="` +
    user.ho +
    `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ho')"></i> </td>
        </tr>
        <tr>
            <td>Tên: </td>
            <td> <input type="text" value="` +
    user.ten +
    `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ten')"></i> </td>
        </tr>
        <tr>
            <td>Email: </td>
            <td> <input type="text" value="` +
    user.email +
    `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'email')"></i> </td>
        </tr>
        <tr>
            <td colspan="3" style="padding:5px; border-top: 2px solid #ccc;"></td>
        </tr>
        <tr>
            <td>Tổng tiền đã mua: </td>
            <td> <input type="text" value="` +
    numToString(tongTienTatCaDonHang) +
    `₫" readonly> </td>
            <td></td>
        </tr>
        <tr>
            <td>Số lượng sản phẩm đã mua: </td>
            <td> <input type="text" value="` +
    tongSanPhamTatCaDonHang +
    `" readonly> </td>
            <td></td>
        </tr>
    </table>`;
}

function openChangePass() {
  var khungChangePass = document.getElementById("khungDoiMatKhau");
  var actived = khungChangePass.classList.contains("active");
  if (actived) khungChangePass.classList.remove("active");
  else khungChangePass.classList.add("active");
}

function changePass() {
  var khungChangePass = document.getElementById("khungDoiMatKhau");
  var inps = khungChangePass.getElementsByTagName("input");
  if (inps[0].value != currentUser.pass) {
    Swal.fire({
      type: "error",
      title: "Sai mật khẩu",
    }).then((result) => {
      inps[0].focus();
    });
    return;
  }
  if (inps[1] == "") {
    Swal.fire({
      type: "error",
      title: "Chưa nhập mật khẩu mới !",
    });
    inps[1].focus();
  }
  if (inps[1].value != inps[2].value) {
    Swal.fire({
      type: "error",
      title: "Mật khẩu không khớp",
    }).then((result) => {
      inps[2].focus();
    });
    return;
  }

  var temp = copyObject(currentUser);
  currentUser.pass = inps[1].value;

  // cập nhật danh sách sản phẩm trong localstorage
  setCurrentUser(currentUser);
  updateListUser(temp, currentUser);

  // Cập nhật trên header
  capNhat_ThongTin_CurrentUser();
  
  iTag.innerHTML = '';

  // thông báo
  Swal.fire({
    type: "success",
    title: "Xong",
    text: "Thay đổi mật khẩu thành công.",
  }).then((result) => {
    inps[0].value = inps[1].value = inps[2].value = "";
    openChangePass();
  });
  // addAlertBox('Thay đổi mật khẩu thành công.', '#5f5', '#000', 4000);
}

function changeInfo(iTag, info) {
  var inp = iTag.parentElement.previousElementSibling.getElementsByTagName(
    "input"
  )[0];

  // Đang hiện
  if (!inp.readOnly && inp.value != "") {
    if (info == "username") {
      var users = getListUser();
      for (var u of users) {
        if (u.username == inp.value && u.username != currentUser.username) {
          alert("Tên đã có người sử dụng !!");
          inp.value = currentUser.username;
          return;
        }
      }
      // Đổi tên trong list đơn hàng
      if (!currentUser.donhang.length) {
        document.getElementsByClassName("listDonHang")[0].innerHTML =
          `
                    <h3 class="empty-noti"> 
                        Xin chào ` +
          inp.value +
          `. Bạn chưa có đơn hàng nào.
                    </h3>`;
      }
    } else if (info == "email") {
      var users = getListUser();
      for (var u of users) {
        if (u.email == inp.value && u.username != currentUser.username) {
          alert("Email đã có người sử dụng !!");
          inp.value = currentUser.email;
          return;
        }
      }
    }

    var temp = copyObject(currentUser);
    currentUser[info] = inp.value;

    // cập nhật danh sách sản phẩm trong localstorage
    setCurrentUser(currentUser);
    updateListUser(temp, currentUser);

    // Cập nhật trên header
    capNhat_ThongTin_CurrentUser();

    iTag.innerHTML = "";
  } else {
    iTag.innerHTML = "Đồng ý";
    inp.focus();
    var v = inp.value;
    inp.value = "";
    inp.value = v;
  }

  inp.readOnly = !inp.readOnly;
}

// Phần thông tin đơn hàng
function addTatCaDonHang(user) {
  if (!user) {
    document.getElementsByClassName("listDonHang")[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: red; font-size: 2em; text-align: center"> 
                Bạn chưa đăng nhập !!
            </h3>`;
    return;
  }
  if (!user.donhang.length) {
    document.getElementsByClassName("listDonHang")[0].innerHTML = ` 
    <h3 class="empty-noti"> 
        Xin chào ${currentUser.username}. Bạn chưa có đơn hàng nào.
    </h3>`;
    return;
  }
  for (var dh of user.donhang) {
    addDonHang(dh);
  }
}

function addDonHang(dh) {
  var div = document.getElementsByClassName("listDonHang")[0];

  var s = `
    <table class="listSanPham">
        <tr> 
            <th colspan="6">
                <h3 style="text-align:center;"> Đơn hàng ngày: ${new Date(
                  dh.ngaymua
                ).toLocaleString()}</h3> 
            </th>
        </tr>
        <tr>
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Thời gian thêm vào giỏ</th> 
        </tr>`;

  var totalPrice = 0;
  for (var i = 0; i < dh.sp.length; i++) {
    var masp = dh.sp[i].ma;
    var soluongSp = dh.sp[i].soluong;
    var p = timKiemTheoMa(list_products, masp);
    var price = p.promo.name == "giareonline" ? p.promo.value : p.price;
    var thoigian = new Date(dh.sp[i].date).toLocaleString();
    var thanhtien = stringToNum(price) * soluongSp;

    s += `
      <tr>
          <td>${i + 1}</td>
          <td class="noPadding imgHide">
              <a target="_blank" href="chitietsanpham.php?${p.name
                .split(" ")
                .join("-")}" title="Xem chi tiết">
                  ${p.name}
                  <img src="${p.img}">
              </a>
          </td>
          <td class="alignRight">${price} ₫</td>
          <td class="soluong" >
                ${soluongSp}
          </td>
          <td class="alignRight">${numToString(thanhtien)} ₫</td>
          <td style="text-align: center" >${thoigian}</td>
      </tr>
  `;
    totalPrice += thanhtien;
    tongSanPhamTatCaDonHang += soluongSp;
  }
  tongTienTatCaDonHang += totalPrice;

  s += `
      <tr style="font-weight:bold; text-align:center; height: 4em;">
          <td colspan="4">TỔNG TIỀN: </td>
          <td class="alignRight">${numToString(totalPrice)} ₫</td>
          <td > ${dh.tinhTrang} </td>
      </tr>
  </table>
  <hr>
        `;
  div.innerHTML += s;
}
